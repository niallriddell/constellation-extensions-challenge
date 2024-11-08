 
import {
  Text,
  Flex,
  Button,
  Icon,
  registerIcon
} from '@pega/cosmos-react-core';
import * as pencil from '@pega/cosmos-react-core/lib/components/Icon/icons/pencil.icon';

registerIcon(pencil);

const View: React.FC = () => {
  return (
    <Flex
      container={{ alignContent: 'stretch', wrap: 'wrap', pad: 2 }}
      height={20}
      width={30}
    >
      <Flex item={{ grow: 1 }}>
        <Text>Item 1</Text>
      </Flex>
      <Flex item={{ grow: 1 }}>
        <Text>Item 2</Text>
      </Flex>
      <Flex item={{ grow: 1 }}>
        <Text>Item 3</Text>
      </Flex>
      <Flex item={{ grow: 1 }}>
        <Text>Item 4</Text>
      </Flex>
      <Flex item={{ grow: 1 }}>
        <Text>Item 5</Text>
      </Flex>
    </Flex>
  );
};

const reviewInner: any = {
  name: 'ReviewInner',
  type: 'View',
  config: {
    ruleClass: 'SL-TellUsMore-Work-Incident',
    template: 'Sl_DXExtensions_NavigateWrapper',
    localeReference: '@LR SL-TELLUSMORE-WORK-INCIDENT!VIEW!REVIEWINNER',
    showLabel: false
  },
  children: [
    {
      name: 'A',
      type: 'Region',
      getPConnect: () => {
        return {
          getChildren: () => reviewInner.children[0].children,
          getValue: () => []
        };
      },
      children: [
        {
          type: 'reference',
          config: {
            name: 'DetermineCategory',
            inheritedProps: [
              {
                prop: 'label',
                value: '@L Determine Category'
              },
              {
                prop: 'showLabel',
                value: true
              }
            ],
            ruleClass: 'SL-TellUsMore-Work-Incident',
            type: 'view',
            context: '@CLASS SL-TellUsMore-Work-Incident'
          },
          getPConnect: () => {
            return {
              getRawMetadata: () => reviewInner.children[0].children[0],
              createComponent: ({ type }: any) => {
                if (type === 'reference') {
                  return <View />;
                }
                return (
                  <Button variant='link'>
                    <Icon name='pencil' />
                    Edit me
                  </Button>
                );
              },
              getComponentName: () => 'reference',
              getLocalizedValue: (text: string) => text
            };
          }
        },
        {
          type: 'reference',
          config: {
            name: 'ContactInfo',
            inheritedProps: [
              {
                prop: 'label',
                value: '@L Contact Info'
              },
              {
                prop: 'showLabel',
                value: true
              }
            ],
            ruleClass: 'SL-TellUsMore-Work-Incident',
            type: 'view',
            context: '@CLASS SL-TellUsMore-Work-Incident'
          },
          getPConnect: () => {
            return {
              getRawMetadata: () => reviewInner.children[0].children[1],
              createComponent: ({ type }: any) => {
                if (type === 'reference') {
                  return <View />;
                }
                return (
                  <Button variant='link'>
                    <Icon name='pencil' />
                    Edit me
                  </Button>
                );
              },
              getComponentName: () => 'reference',
              getLocalizedValue: (text: string) => text
            };
          }
        }
      ]
    }
  ],
  classID: 'SL-TellUsMore-Work-Incident'
};

export default reviewInner;
