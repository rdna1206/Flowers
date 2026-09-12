import { GoogleGenAI, Type } from '@google/genai';
import type { UserRecord, FlowerFormulation } from '../src/types.js';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in the environment.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        timeout: 15000,
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableDemandError(error: any): boolean {
  if (!error) return false;
  const msg = (error.message || String(error)).toLowerCase();
  const status = String(error.status || error.code || '');
  return (
    status === '503' ||
    status === '429' ||
    status === 'UNAVAILABLE' ||
    status === 'RESOURCE_EXHAUSTED' ||
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('high demand') ||
    msg.includes('unavailable') ||
    msg.includes('rate limit') ||
    msg.includes('quota') ||
    msg.includes('spikes in demand')
  );
}

export async function generateFloralFormulationForUser(
  user: UserRecord
): Promise<FlowerFormulation> {
  // If the admin has already provided a fixed custom formulation, use it directly
  if (user.flowerConfig?.customFormulation) {
    return user.flowerConfig.customFormulation;
  }

  // Check if Gemini API key is available
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Graceful fallback formulation if API key is not yet set
    return createFallbackFormulation(user);
  }

  const ai = getGeminiClient();

  const profilingText =
    user.profiling && !user.profiling.includes('[PENDIENTE')
      ? user.profiling
      : 'Perfil en preparación por el administrador. Personalidad sensible, reflexiva y única.';

  const instructionsText =
    user.flowerConfig?.specificInstructions &&
    !user.flowerConfig.specificInstructions.includes('[PENDIENTE')
      ? user.flowerConfig.specificInstructions
      : 'Crear una formulación armónica, botánica y elegante acorde a la persona.';

  const prompt = `Actúa como un maestro botánico y florista de alta sensibilidad.
Crea una FORMULACIÓN FLORAL PERSONALIZADA Y EXCLUSIVA para el usuario "${user.name}".

IMPORTANTE:
- Esta formulación es ÚNICA para ${user.name}.
- Basa tu análisis exclusivamente en los datos provistos a continuación.
- NO mezcles perfiles ni inventes detalles biográficos ajenos.
- La selección de flores debe tener simbolismo botánico real, nombres científicos precisos y un significado profundo.

DATOS DEL USUARIO:
- Nombre: ${user.name}
- Perfilamiento individual: ${profilingText}
- Instrucciones de formulación: ${instructionsText}
- Tono estético: ${user.flowerConfig?.preferredTone || 'Elegante, botánico, íntimo y delicado'}

Genera una formulación completa y detallada con entre 3 y 4 flores perfectamente armonizadas.`;

  const schemaConfig = {
    systemInstruction:
      'Eres un botánico y diseñador floral poético de prestigio internacional. Generas formulaciones florales personalizadas ricas en significado, precisión botánica y belleza estética en español. Responde siempre en formato JSON válido de acuerdo al esquema solicitado.',
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'Título elegante para la formulación floral del usuario',
        },
        essence: {
          type: Type.STRING,
          description: 'Esencia conceptual de la mezcla floral en una o dos frases',
        },
        flowers: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'Nombre común de la flor',
              },
              botanicalName: {
                type: Type.STRING,
                description: 'Nombre científico botánico en latín',
              },
              meaning: {
                type: Type.STRING,
                description: 'Significado simbólico y conexión con la persona',
              },
              role: {
                type: Type.STRING,
                description:
                  'Función en el ramo: Flor Principal, Acorde de Fondo, Toque Silvestre o Nota Aromática',
              },
              color: {
                type: Type.STRING,
                description: 'Color o tono descriptivo y código hexadecimal como #D98880',
              },
            },
            required: ['name', 'botanicalName', 'meaning', 'role', 'color'],
          },
        },
        synergy: {
          type: Type.STRING,
          description:
            'Explicación botánica y emocional de la sinergia entre las flores seleccionadas',
        },
        finalDedication: {
          type: Type.STRING,
          description:
            'Mensaje poético de cierre dedicado con delicadeza a la persona',
        },
      },
      required: ['title', 'essence', 'flowers', 'synergy', 'finalDedication'],
    },
  };

  // Try across candidate models with retry backoff on transient 503/429 spikes
  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: schemaConfig,
        });

        let text = response.text ? response.text.trim() : '';
        if (text.startsWith('```')) {
          text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
        }

        if (!text) {
          throw new Error(`El modelo ${model} retornó una respuesta vacía.`);
        }

        const parsed = JSON.parse(text);
        if (!parsed.flowers || !Array.isArray(parsed.flowers) || parsed.flowers.length === 0) {
          throw new Error(`El modelo ${model} retornó una estructura sin flores.`);
        }

        return {
          title: parsed.title || `Formulación Floral para ${user.name}`,
          essence: parsed.essence || 'Una composición botánica en armonía con tu ser.',
          flowers: parsed.flowers,
          synergy: parsed.synergy || '',
          finalDedication:
            parsed.finalDedication ||
            `Dedicada con aprecio y delicadeza a ${user.name}.`,
          generatedAt: new Date().toISOString(),
        };
      } catch (error: any) {
        const retryable = isRetryableDemandError(error);
        console.warn(
          `[Gemini] Intento ${attempt} con modelo "${model}" para ${user.name} falló (${error?.status || error?.code || 'error'}): ${error?.message || error}`
        );

        if (attempt < 2 && retryable) {
          await sleep(600 * attempt);
          continue;
        }

        // If retryable and attempts exhausted for this model, proceed to the next fallback model
        break;
      }
    }
  }

  // Graceful bespoke fallback if all models experienced temporary demand peaks
  console.warn(
    `[Gemini] Aplicando formulación botánica personalizada de reserva para ${user.name}.`
  );
  return createFallbackFormulation(user);
}

function createFallbackFormulation(user: UserRecord): FlowerFormulation {
  // Rich catalog of personalized botanic profiles per user or based on name characteristics
  const tone = (user.flowerConfig?.preferredTone || '').toLowerCase();
  const userName = user.name.trim();

  // Curated individualized palettes
  const profiles: Record<string, FlowerFormulation> = {
    ronald: {
      title: `Sinfonía Botánica Imperial para ${userName}`,
      essence: `Una arquitectura floral de porte sereno, raíces profundas y distinción noble concebida para ${userName}.`,
      flowers: [
        {
          name: 'Orquídea Dorada',
          botanicalName: 'Cymbidium erythrostylum',
          meaning: 'Símbolo de visión serena, liderazgo reflexivo y persistencia noble.',
          role: 'Flor Principal',
          color: '#D4AF37',
        },
        {
          name: 'Peonía Imperial',
          botanicalName: 'Paeonia suffruticosa',
          meaning: 'Generosidad de espíritu, dignidad silenciosa y afecto protector.',
          role: 'Acorde de Fondo',
          color: '#E6A598',
        },
        {
          name: 'Olivo Milenario',
          botanicalName: 'Olea europaea',
          meaning: 'Sabiduría duradera, templanza y acuerdos de paz inquebrantables.',
          role: 'Toque Silvestre',
          color: '#8A9A86',
        },
        {
          name: 'Cedro del Atlas',
          botanicalName: 'Cedrus atlantica',
          meaning: 'Firmeza ante la adversidad y protección serena para los suyos.',
          role: 'Nota Aromática',
          color: '#937C67',
        },
      ],
      synergy:
        'El Cymbidium dorado aporta la altura y visión de liderazgo, contrastado con la calidez terrosa de la peonía y la templanza del olivo centenario.',
      finalDedication: `Para ${userName}, cuya dedicación paciente edifica espacios de confianza y memoria compartida.`,
      generatedAt: new Date().toISOString(),
    },
    isabella: {
      title: `Brisa de Pétalos Suaves para ${userName}`,
      essence: `Un acorde delicado y luminoso donde la gracia y la gentileza florecen en perfecta armonía.`,
      flowers: [
        {
          name: 'Rosa de Té Silvestre',
          botanicalName: 'Rosa odorata',
          meaning: 'Ternura sincera, gracia natural y belleza sin artificios.',
          role: 'Flor Principal',
          color: '#E8A598',
        },
        {
          name: 'Flor de Almendro',
          botanicalName: 'Prunus dulcis',
          meaning: 'Despertar de la esperanza y sensibilidad ante los pequeños detalles.',
          role: 'Acorde de Fondo',
          color: '#F9D5D3',
        },
        {
          name: 'Violeta de Bosque',
          botanicalName: 'Viola odorata',
          meaning: 'Modestia noble, intuición viva y lealtad en la quietud.',
          role: 'Toque Silvestre',
          color: '#A594B8',
        },
        {
          name: 'Salvia Blanca',
          botanicalName: 'Salvia apiana',
          meaning: 'Claridad en los pensamientos y frescura emocional purificadora.',
          role: 'Nota Aromática',
          color: '#8A9A86',
        },
      ],
      synergy:
        'La rosa de té otorga el centro afectivo y cálido, mientras el almendro y la violeta aportan una luminosidad sutil y apaciguadora.',
      finalDedication: `Que la sutileza de estas flores refleje la luz serena con la que iluminas cada instante, ${userName}.`,
      generatedAt: new Date().toISOString(),
    },
    jhon: {
      title: `Estructura Botánica de Firmeza para ${userName}`,
      essence: `Un ensamble de notas sobrias, verdes profundos y pureza que honran el carácter firme y honesto.`,
      flowers: [
        {
          name: 'Iris Azul de Montaña',
          botanicalName: 'Iris germanica',
          meaning: 'Elocuencia serena, sinceridad incondicional y fe en los propósitos.',
          role: 'Flor Principal',
          color: '#6B82A8',
        },
        {
          name: 'Camelia Blanca',
          botanicalName: 'Camellia japonica',
          meaning: 'Gratitud genuina, constancia inmutable y devoción en el afecto.',
          role: 'Acorde de Fondo',
          color: '#F5F5F0',
        },
        {
          name: 'Eucalipto Plateado',
          botanicalName: 'Eucalyptus cinerea',
          meaning: 'Renovación constante, resguardo y claridad mental.',
          role: 'Nota Aromática',
          color: '#7F9A95',
        },
        {
          name: 'Brezo Silvestre',
          botanicalName: 'Calluna vulgaris',
          meaning: 'Resiliencia ante terrenos difíciles y fortuna silenciosa.',
          role: 'Toque Silvestre',
          color: '#B0889A',
        },
      ],
      synergy:
        'El iris comanda la presencia con sobria dignidad, arropado por la pureza de la camelia y el aroma fresco del eucalipto.',
      finalDedication: `Para ${userName}, en reconocimiento a la honestidad inquebrantable y el valor de su compañía constante.`,
      generatedAt: new Date().toISOString(),
    },
    shaday: {
      title: `Jardín de Calidez y Luz para ${userName}`,
      essence: `Una formulación vibrante y afectiva que destila optimismo contagioso y espontaneidad sincera.`,
      flowers: [
        {
          name: 'Dalia Coral',
          botanicalName: 'Dahlia pinnata',
          meaning: 'Fuerza interior alegre, elegancia viva y autenticidad espontánea.',
          role: 'Flor Principal',
          color: '#E07A5F',
        },
        {
          name: 'Flor de Azahar',
          botanicalName: 'Citrus aurantium',
          meaning: 'Inocencia de intenciones, alegría duradera y pureza de corazón.',
          role: 'Nota Aromática',
          color: '#FFF8E7',
        },
        {
          name: 'Mimosa Dorada',
          botanicalName: 'Acacia dealbata',
          meaning: 'Sensibilidad perceptiva, calidez humana y expansión luminosa.',
          role: 'Acorde de Fondo',
          color: '#F4D06F',
        },
        {
          name: 'Helecho Real',
          botanicalName: 'Osmunda regalis',
          meaning: 'Misterio protector, adaptabilidad y frescura natural.',
          role: 'Toque Silvestre',
          color: '#52796F',
        },
      ],
      synergy:
        'La energía coral de la dalia encuentra su complemento perfecto en la flor de azahar y los destellos dorados de la mimosa.',
      finalDedication: `Para ${userName}, que tu espíritu conserve siempre la chispa y la calidez que renuevan a quienes te rodean.`,
      generatedAt: new Date().toISOString(),
    },
  };

  const key = user.id.toLowerCase();
  if (profiles[key]) {
    return profiles[key];
  }

  // Universal elegant botanic profile adapted to the person
  return {
    title: `Acorde Floral de Serenidad y Nobleza para ${userName}`,
    essence: `Una formulación botánica poética concebida para honrar la presencia, sensibilidad y carácter de ${userName}.`,
    flowers: [
      {
        name: 'Peonía Silvestre',
        botanicalName: 'Paeonia mascula',
        meaning: 'Símbolo de nobleza interior, calidez protectora y afecto sincero.',
        role: 'Flor Principal',
        color: '#E6A598',
      },
      {
        name: 'Lavanda de Altura',
        botanicalName: 'Lavandula angustifolia',
        meaning: 'Claridad mental, paz en el pensamiento y lealtad tranquila.',
        role: 'Acorde de Serenidad',
        color: '#A594B8',
      },
      {
        name: 'Jazmín Real',
        botanicalName: 'Jasminum officinale',
        meaning: 'Elegancia sutil, gracia y luz serena en momentos de quietud.',
        role: 'Nota Aromática',
        color: '#F4E8C1',
      },
      {
        name: 'Olivo en Brote',
        botanicalName: 'Olea europaea',
        meaning: 'Armonía perdurable, esperanza firme y raíces profundas.',
        role: 'Toque Silvestre',
        color: '#8A9A86',
      },
    ],
    synergy:
      'La combinación equilibra notas florales envolventes con la frescura herbácea del olivo y la lavanda, creando un refugio aromático de calma y reconocimiento mutuo.',
    finalDedication: `Que esta selección floral te acompañe como un recordatorio silencioso de belleza, paciencia y afecto sincero, ${userName}.`,
    generatedAt: new Date().toISOString(),
  };
}
