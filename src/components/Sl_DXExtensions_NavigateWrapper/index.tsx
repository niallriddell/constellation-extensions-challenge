import { useMemo, useState } from 'react';

import {
  FieldGroup,
  Progress,
  withConfiguration
} from '@pega/cosmos-react-core';

import type { PConnFieldProps } from './PConnProps';
import StyledNavigateWrapper from './styles';
import './create-nonce';

import type { ComponentMetadataConfig } from '@pega/pcore-pconnect-typedefs/interpreter/types';

interface SlDxExtensionsNavigateWrapperProps extends PConnFieldProps {
  showLabel: boolean;
}

interface SummaryItem {
  view: React.ReactNode | null;
  action: React.ReactNode | null;
}

interface CustomComponentMetadataConfig extends ComponentMetadataConfig {
  stepID: string;
}

const createSummaryItems = (pConnect: typeof PConnect): SummaryItem[] => {
  const summaryItems: SummaryItem[] = [];
  const displayValue = pConnect.getLocalizedValue('Edit');
  const regionPConnect = pConnect.hasChildren()
    ? pConnect.getChildren()[0].getPConnect()
    : undefined;

  if (!regionPConnect) return summaryItems;
  const steps =
    pConnect.getValue(PCore.getConstants().CASE_INFO.NAVIGATION)?.steps || [];

  regionPConnect
    .getChildren()
    .forEach(({ getPConnect }: { getPConnect: () => typeof PConnect }) => {
      const rawConfig = getPConnect().getRawMetadata();
      if (!rawConfig?.config) return;

      const isReference = getPConnect().getComponentName() === 'reference';

      if (isReference) {
        rawConfig.config.displayMode = 'DISPLAY_ONLY';
        rawConfig.config.readOnly = true;
      }

      const reference = getPConnect().createComponent(rawConfig, '', 0, null);

      if (reference?.props?.visibility === false) {
        return;
      }

      const navigateStep: any[] =
        steps.length > 0 && rawConfig?.config?.name
          ? steps.filter(
              (step: any) => step.actionID === rawConfig?.config?.name
            )
          : [{ ID: '0', name: 'Navigate To Step' }];

      if (!navigateStep || navigateStep.length === 0) {
        return;
      }

      const tooltipText = getPConnect().getLocalizedValue(navigateStep[0].name);

      const action = getPConnect().createComponent(
        {
          type: 'Sl_DXExtensions_NavigateToStep',
          config: {
            stepID: navigateStep[0].ID,
            label: 'NavigateToStep',
            text: displayValue,
            tooltip: tooltipText,
            visibility: true,
            variant: 'link',
            iconName: 'pencil',
            icon: false
          } as CustomComponentMetadataConfig
        },
        '',
        0,
        null
      );

      summaryItems.push({ view: reference, action });
    });

  return summaryItems;
};

function SlDxExtensionsNavigateWrapper({
  getPConnect,
  label,
  showLabel = false
}: Readonly<SlDxExtensionsNavigateWrapperProps>) {
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };

  const [customComponentLoaded, setCustomComponentLoaded] = useState<boolean>(
    PCore.getComponentsRegistry().getCustomComponent(
      'Sl_DXExtensions_NavigateToStep'
    ) !== undefined
  );

  const newChildren = useMemo(
    () => createSummaryItems(getPConnect()),
    [getPConnect]
  );

  if (!customComponentLoaded) {
    PCore.getAssetLoader()
      .getLoader('component-loader')(['Sl_DXExtensions_NavigateToStep'])
      .then(() => setCustomComponentLoaded(true));

    return <Progress variant='ring' placement='local' />;
  }

  const showName =
    propsToUse.showLabel && getPConnect().getLocalizedValue(propsToUse.label);

  return (
    <FieldGroup name={showName || undefined}>
      {newChildren.map((summaryItem: SummaryItem, i: number) => (
        <StyledNavigateWrapper
          key={`summaryItem-${i + 1}`}
          primary={summaryItem.view}
          actions={summaryItem.action}
        />
      ))}
    </FieldGroup>
  );
}

export default withConfiguration(SlDxExtensionsNavigateWrapper);
