import { createTourStatus } from '../api/createTourStatus';
import { getTourStatus } from '../api/getTourStatus';
import { offset } from '@floating-ui/dom';
import i18next from 'i18next';
import { ShepherdOptionsWithType, Tour } from 'react-shepherd';
import { toast } from 'react-toastify';

const t = i18next.t;

const standardButtons = [
  {
    text: t('guidedTour:back'),
    type: 'back',
  },
  {
    text: t('guidedTour:next'),
    type: 'next',
  },
];

const arrowOptions = {
  middleware: [offset(15)],
};

export const steps: ShepherdOptionsWithType[] = (await showTour())
  ? [
      {
        id: 'welcome',
        title: t('guidedTour:mapEditor.welcome_title'),
        text: t('guidedTour:mapEditor.welcome_text'),
        buttons: [
          {
            text: t('guidedTour:next'),
            type: 'next',
          },
        ],
      },
      {
        id: 'toolboxIntro',
        title: t('guidedTour:mapEditor.toolboxIntro_title'),
        text: t('guidedTour:mapEditor.toolboxIntro_text'),
        buttons: standardButtons,
        attachTo: {
          element: '[data-testid="toolbox"]',
          on: 'right',
        },
      },
      {
        id: 'layersIntro',
        title: t('guidedTour:mapEditor.layersIntro_title'),
        text: t('guidedTour:mapEditor.layersIntro_text'),
        buttons: standardButtons,
        attachTo: {
          element: '[data-testid="layers"]',
          on: 'left',
        },
      },
      {
        id: 'timelineIntro',
        title: t('guidedTour:mapEditor.timelineIntro_title'),
        text: t('guidedTour:mapEditor.timelineIntro_text'),
        buttons: standardButtons,
        attachTo: {
          element: '[data-testid="timeline"]',
          on: 'top',
        },
      },
      {
        id: 'baseLayerIntro',
        title: `${t('guidedTour:mapEditor.baseLayer_title')} (1/2)`,
        text: t('guidedTour:mapEditor.baseLayerIntro_text'),
        buttons: standardButtons,
      },
      {
        id: 'baseLayerToolbar',
        title: `${t('guidedTour:mapEditor.baseLayer_title')} (2/2)`,
        text: t('guidedTour:mapEditor.baseLayerToolbar_text'),
        buttons: standardButtons,
        attachTo: {
          element: '[data-testid="bottomRightToolbar"]',
          on: 'left',
        },
      },
      {
        id: 'plantsLayerIntro',
        title: `${t('guidedTour:mapEditor.plantsLayer_title')} (1/7)`,
        text: t('guidedTour:mapEditor.plantsLayerIntro_text'),
        buttons: standardButtons,
      },
      {
        id: 'plantsLayerSelect',
        title: `${t('guidedTour:mapEditor.plantsLayer_title')} (2/7)`,
        text: t('guidedTour:mapEditor.plantsLayerSelect_text'),
        buttons: [
          {
            text: t('guidedTour:back'),
            type: 'back',
          },
        ],
        attachTo: {
          element: '[data-testid="plantsSelect"]',
          on: 'left',
        },
        advanceOn: {
          selector: '[data-testid="plantsSelect"]',
          event: 'click',
        },
        canClickTarget: true,
      },
      {
        id: 'plantsLayerRightToolbar',
        title: `${t('guidedTour:mapEditor.plantsLayer_title')} (3/7)`,
        text: t('guidedTour:mapEditor.plantsLayerRightToolbar_text'),
        buttons: standardButtons,
        attachTo: {
          element: '[data-testid="bottomRightToolbar"]',
          on: 'left',
        },
      },
      {
        id: 'plantsLayerPlantingSearch',
        title: `${t('guidedTour:mapEditor.plantsLayer_title')} (4/7)`,
        text: t('guidedTour:mapEditor.plantsLayerPlantingSearch'),
        attachTo: {
          element: '[data-testid="searchButton"]',
          on: 'left',
        },
        advanceOn: {
          selector: '[data-testid="searchButton"]',
          event: 'click',
        },
        canClickTarget: true,
      },
      {
        id: 'plantsLayerPlantingSelect',
        title: `${t('guidedTour:mapEditor.plantsLayer_title')} (5/7)`,
        text: t('guidedTour:mapEditor.plantsLayerPlantingSelect'),
        attachTo: {
          element: '[data-testid="bottomRightToolbar"]',
          on: 'left',
        },
        advanceOn: {
          selector: '[data-testid="plantList"]',
          event: 'click',
        },
        beforeShowPromise: function () {
          return new Promise(function (resolve) {
            setTimeout(() => resolve(null), 10);
          });
        },
        canClickTarget: true,
      },
      {
        id: 'plantsLayerPlantingPlace',
        title: `${t('guidedTour:mapEditor.plantsLayer_title')} (6/7)`,
        text: t('guidedTour:mapEditor.plantsLayerPlantingPlace'),
        attachTo: {
          element: '[data-testid="canvas"]',
          on: 'top',
        },
        advanceOn: {
          selector: '[data-testid="canvas"]',
          event: 'click',
        },
        canClickTarget: true,
      },
      {
        id: 'plantsLayerLeftToolbar',
        title: `${t('guidedTour:mapEditor.plantsLayer_title')} (7/7)`,
        text: t('guidedTour:mapEditor.plantsLayerLeftToolbar_text'),
        buttons: standardButtons,
        attachTo: {
          element: '[data-testid="bottomLeftToolbar"]',
          on: 'right',
        },
      },
      {
        id: 'congratulations',
        title: t('guidedTour:mapEditor.congratulations_title'),
        text: t('guidedTour:mapEditor.congratulations_text'),
        buttons: [
          {
            text: t('guidedTour:finish'),
            type: 'next',
          },
        ],
      },
    ]
  : [];

export const tourOptions: Tour.TourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
    floatingUIOptions: arrowOptions,
    canClickTarget: false,
  },
  useModalOverlay: true,
};

async function editorTourStatus() {
  try {
    const tourStatus = await getTourStatus();
    return tourStatus.editor_tour_completed;
  } catch (error) {
    await createTourStatus();
    return false;
  }
}

async function showTour() {
  try {
    const show = await editorTourStatus();
    return !show;
  } catch (error) {
    console.error(error);
    toast.error('', { autoClose: false });
    return true;
  }
}
