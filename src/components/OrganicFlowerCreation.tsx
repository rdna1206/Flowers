import React from 'react';
import type { UserExperienceData } from '../types';
import { JhonBouquetAnimation } from './JhonBouquetAnimation';
import { IsaiasBouquetAnimation } from './IsaiasBouquetAnimation';
import { GenesisBouquetAnimation } from './GenesisBouquetAnimation';
import { AndreaBouquetAnimation } from './AndreaBouquetAnimation';
import { ShadayBouquetAnimation } from './ShadayBouquetAnimation';
import { IsabellaBouquetAnimation } from './IsabellaBouquetAnimation';
import { HanniaBouquetAnimation } from './HanniaBouquetAnimation';
import { LucianaBouquetAnimation } from './LucianaBouquetAnimation';
import { StanleyBouquetAnimation } from './StanleyBouquetAnimation';
import { DileidysBouquetAnimation } from './DileidysBouquetAnimation';
import { LeiryBouquetAnimation } from './LeiryBouquetAnimation';
import { CarlosBouquetAnimation } from './CarlosBouquetAnimation';
import { KeicyBouquetAnimation } from './KeicyBouquetAnimation';
import { PaulaBouquetAnimation } from './PaulaBouquetAnimation';
import { DefaultBouquetAnimation } from './DefaultBouquetAnimation';

interface OrganicFlowerCreationProps {
  experience: UserExperienceData;
  mode: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse: () => void;
  onBackToReading: () => void;
  onReplayFormation: () => void;
}

export const OrganicFlowerCreation: React.FC<OrganicFlowerCreationProps> = ({
  experience,
  mode,
  onProceedToReading,
  onProceedToResponse,
  onBackToReading,
  onReplayFormation,
}) => {
  const isJhon = experience.id === 'jhon' || experience.username?.toLowerCase() === 'jhon';
  const isIsaias = experience.id === 'isaias' || experience.username?.toLowerCase() === 'isaias';
  const isGenesis = experience.id === 'genesis' || experience.username?.toLowerCase() === 'genesis';
  const isAndrea = experience.id === 'andrea' || experience.username?.toLowerCase() === 'andrea';
  const isShaday = experience.id === 'shaday' || experience.username?.toLowerCase() === 'shaday';
  const isIsabella = experience.id === 'isabella' || experience.username?.toLowerCase() === 'isabella';
  const isHannia = experience.id === 'hannia' || experience.username?.toLowerCase() === 'hannia';
  const isLuciana = experience.id === 'luciana' || experience.username?.toLowerCase() === 'luciana';
  const isStanley = experience.id === 'stanley' || experience.username?.toLowerCase() === 'stanley';
  const isDileidys = experience.id === 'dileidys' || experience.username?.toLowerCase() === 'dileidys';
  const isLeiry = experience.id?.toLowerCase() === 'leiry' || experience.username?.toLowerCase() === 'leiry' || experience.name?.toLowerCase().includes('leiry');
  const isCarlos = experience.id?.toLowerCase() === 'carlos' || experience.username?.toLowerCase() === 'carlos' || experience.name?.toLowerCase().includes('carlos');
  const isKeicy = experience.id?.toLowerCase() === 'keicy' || experience.username?.toLowerCase() === 'keicy' || experience.name?.toLowerCase().includes('keicy');
  const isPaula = experience.id?.toLowerCase() === 'paula' || experience.username?.toLowerCase() === 'paula' || experience.name?.toLowerCase().includes('paula');

  // Jhon's Bespoke Handcrafted Bouquet of Yellow Blooms & Signature Cobalt/Thunder/Shadow Flower
  if (isJhon) {
    return (
      <JhonBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Isaías's Bespoke Handcrafted Bouquet of Yellow Blooms & Signature Aquatic Sapphire/Keeper Flower
  if (isIsaias) {
    return (
      <IsaiasBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Génesis's Bespoke Handcrafted Bouquet of Yellow Blooms & Signature Sapphire & Porcelain Star-Iris (Azul, Beige y Amarillo)
  if (isGenesis) {
    return (
      <GenesisBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Andrea's Bespoke Handcrafted Bouquet in Rosa, Rojo y Morado & Signature Royal Carmine & Amethyst Orchid
  if (isAndrea) {
    return (
      <AndreaBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Shaday's Bespoke Handcrafted Bouquet in Azul, Negro, Blanco y Rojo & Signature Mystic Crimson-Sapphire Rose
  if (isShaday) {
    return (
      <ShadayBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Isabella's Bespoke Handcrafted Bouquet of Yellow Blooms & Signature Pastel Prism Peony (Azul, Rosadito Pastel, Verdecito Pastel y Lila)
  if (isIsabella) {
    return (
      <IsabellaBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Hannia's Bespoke Handcrafted Bouquet of Yellow Blooms & Signature Camelia/Bloom in Rosa and Azul
  if (isHannia) {
    return (
      <HanniaBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Luciana's Bespoke Handcrafted Bouquet of Yellow Blooms & Signature Mystic Imperial Bloom (Black, Electric Purple, Gold, White)
  if (isLuciana) {
    return (
      <LucianaBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Stanley's Bespoke Handcrafted Bouquet of Yellow Blooms & Signature Sculpted Monochrome Bloom (Black & White)
  if (isStanley) {
    return (
      <StanleyBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Dileidys's Bespoke Handcrafted Bouquet of Yellow Blooms & Signature Velvet Pink Romantic Peony
  if (isDileidys) {
    return (
      <DileidysBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Leiry's Bespoke Handcrafted Bouquet (Negro, Vinotinto y Morado Oscuro e Intenso)
  if (isLeiry) {
    return (
      <LeiryBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Carlos's Bespoke Handcrafted Bouquet: Ave del Paraíso Astral (Strelitzia Celestial in Azul Rey, Azul Noche, Negro y Ámbar)
  if (isCarlos) {
    return (
      <CarlosBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Keicy's Bespoke Handcrafted Bouquet: Abundant Yellow Blooms with Signature Flor Loto Astral (Vinotinto, Rosado y Violeta)
  if (isKeicy) {
    return (
      <KeicyBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Paula's Bespoke Handcrafted Bouquet: Abundant Yellow Blooms with Signature Corola Escarlata y Cáliz Imperial (Rosa, Lila y Rojo)
  if (isPaula) {
    return (
      <PaulaBouquetAnimation
        mode={mode}
        onProceedToReading={onProceedToReading || onBackToReading}
        onProceedToResponse={onProceedToResponse}
        onBackToReading={onBackToReading}
        onReplayFormation={onReplayFormation}
      />
    );
  }

  // Default Handcrafted Bouquet for Other Profiles / Previews
  return (
    <DefaultBouquetAnimation
      experience={experience}
      mode={mode}
      onProceedToReading={onProceedToReading || onBackToReading}
      onProceedToResponse={onProceedToResponse}
      onBackToReading={onBackToReading}
      onReplayFormation={onReplayFormation}
    />
  );
};
