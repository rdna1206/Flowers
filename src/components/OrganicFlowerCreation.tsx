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
import { DefaultBouquetAnimation } from './DefaultBouquetAnimation';

interface OrganicFlowerCreationProps {
  experience: UserExperienceData;
  mode: 'formation' | 'result';
  onProceedToResponse: () => void;
  onBackToReading: () => void;
  onReplayFormation: () => void;
}

export const OrganicFlowerCreation: React.FC<OrganicFlowerCreationProps> = ({
  experience,
  mode,
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

  // Jhon's Bespoke Handcrafted Bouquet of Yellow Blooms & Signature Cobalt/Thunder/Shadow Flower
  if (isJhon) {
    return (
      <JhonBouquetAnimation
        mode={mode}
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
      onProceedToResponse={onProceedToResponse}
      onBackToReading={onBackToReading}
      onReplayFormation={onReplayFormation}
    />
  );
};
