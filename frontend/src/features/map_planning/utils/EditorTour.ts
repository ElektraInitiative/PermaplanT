import { TFunction } from 'i18next';
import { ShepherdOptionsWithType, Tour } from 'react-shepherd';

export function getSteps(t: TFunction): ShepherdOptionsWithType[] {
  t('ok');
  return [
    {
      id: 'welcome',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'toolboxIntro',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'layersIntro',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'timelineIntro',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'szenarioIntro',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'baseLayerIntro',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'baseLayerToolbar',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'baseImageSelect',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'plantsLayerIntro',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'plantsLayerSelect',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'plantsLayerRightToolbar',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'plantsLayerLeftToolbar',
      buttons: [
        {
          text: 'Next',
          type: 'next',
        },
      ],
    },
    {
      id: 'finish',
      buttons: [
        {
          text: 'Finish',
          type: 'next',
        },
      ],
    },
  ];
}

export const tourOptions: Tour.TourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
};
