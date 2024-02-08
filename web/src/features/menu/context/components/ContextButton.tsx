import { Button, Box, Group, Stack, Text, Progress, HoverCard, Image, createStyles } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactMarkdown from 'react-markdown';
import { Option, ContextMenuProps } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean }) => ({
  inner: {
    borderRadius: 100,
  },
  label: {
    padding: 6,
    color: params.disabled ? theme.colors.dark[9] : theme.colors.dark[9],
    backgroundColor: theme.colors.violet[3],
    fontSize: 12,
    fontVariant: 'small-caps',
    fontStyle: 'bold',
    borderRadius: 90,
    width: '100%',
    '&:hover': {
      backgroundColor: theme.colors.violet[2],
    }
  },
  button: {
    height: '100%',
    width: '100%',
    padding: 5,
    borderRadius: 100,
    backgroundColor: theme.colors.violet[3],
    '&:hover': {
      backgroundColor: theme.colors.violet[2],
    }
  },
  iconImage: {
    maxWidth: '25px',
  },
  description: {
    color: params.disabled ? theme.colors.dark[9] : theme.colors.dark[9],
    fontSize: 11,
    fontVariant: 'small-caps',
    textAlign: 'center',
    width: '100%',
  },
  dropdown: {
    padding: 10,
    backgroundColor: theme.colors.violet[3],
    opacity: 0,
    color: theme.colors.dark[9],
    fontSize: 12,
    maxWidth: 256,
    width: 'fit-content',
    border: 'none',
  },
  buttonStack: {
    gap: 4,
    flex: '1',
  },
  buttonGroup: {
    gap: 3,
    flexWrap: 'nowrap',
    display: 'flex',
    flexDirection: 'initial',
    justifyContent: 'left',
    direction: 'rtl',
    
  },
  buttonIconContainer: {
    justifyContent: 'center',
    
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
    
  },
  buttonArrowContainer: {
    overflowWrap: 'break-word',
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label }}
            onClick={() => (!button.disabled ? (button.menu ? openMenu(button.menu) : clickContext(buttonKey)) : null)}
            variant="default"
            className={classes.button}
            disabled={button.disabled}
          >
            <Group position="apart" w="100%" noWrap>
              <Stack className={classes.buttonStack}>
                <Group className={classes.buttonGroup}>
                  {button?.icon && (
                    <Stack className={classes.buttonIconContainer}>
                      {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                        <img src={button.icon} className={classes.iconImage} alt="Missing img" />
                      ) : (
                        <FontAwesomeIcon
                          icon={button.icon as IconProp}
                          fixedWidth
                          size="lg"
                          style={{ color: button.iconColor }}
                        />
                      )}
                    </Stack>
                  )}
                  <Text className={classes.buttonTitleText}>
                    <ReactMarkdown>{button.title || buttonKey}</ReactMarkdown>
                  </Text>
                </Group>
                {button.description && (
                  <Text className={classes.description}>
                    <ReactMarkdown>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress value={button.progress} size="sm" color={button.colorScheme || 'dark.3'} />
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={classes.buttonArrowContainer}>
                  <FontAwesomeIcon icon="chevron-right" fixedWidth />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (metadata: string | { label: string; value?: any; progress?: number }, index: number) => (
                <>
                  <Text key={`context-metadata-${index}`}>
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress value={metadata.progress} size="sm" color={button.colorScheme || 'dark.3'} />
                  )}
                </>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                  <Text key={`context-metadata-${index}`}>
                    {metadata[0]}: {metadata[1]}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
