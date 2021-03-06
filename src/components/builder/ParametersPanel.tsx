import React from 'react';
import { inject, observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { Keyframes } from './Keyframes';
import { IFormComponentCommonProperties } from './elements';
let fieldType: string | null = null;

export const ParametersPanel = inject('formBuilderStore')(
  observer(({ formBuilderStore }) => {
    const {
      currentComponent,
      duplicateField,
      removeField,
      selectedIndex,
      editComponentProperty,
      removeComponent,
      containerProperties,
      editContainerProperty
    } = formBuilderStore;
    const mapProperties = (obj: object, propertyName: string | null, depth?: number) => {
      if (typeof depth === 'number') {
        depth++;
      } else {
        depth = 1;
        fieldType = null;
      }
      if (propertyName && !Number.isInteger(parseInt(propertyName, 0))) {
        fieldType = propertyName;
      }

      return (
        <div id={propertyName ? propertyName : undefined}>
          {Object.keys(obj).map((property, index) => {
            const type = fieldType;
            return (
              <React.Fragment key={index}>
                {depth === 2 ? (
                  <div>
                    <Typography inline>
                      {type} {index + 1}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        duplicateField(selectedIndex, type, index);
                      }}
                    >
                      <Add />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        removeField(selectedIndex, type, index);
                      }}
                    >
                      <Remove />
                    </IconButton>
                  </div>
                ) : null}

                {typeof obj[property] === 'object' ? (
                  mapProperties(obj[property], property, depth)
                ) : (
                  <div style={{ padding: '0.5rem' }}>
                    <TextField
                      label={property}
                      value={obj[property]}
                      fullWidth
                      onChange={
                        fieldType
                          ? e => {
                              editComponentProperty(selectedIndex, property, e.target.value, type, propertyName);
                            }
                          : e => {
                              editComponentProperty(selectedIndex, property, e.target.value);
                            }
                      }
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {depth === 1 ? <Divider variant="middle" /> : null}
        </div>
      );
    };
    const { keyframes, duration, delay, ...rest }: IFormComponentCommonProperties = currentComponent.properties || {};
    return (
      <>
        <Typography variant="h4">
          Properties
          {selectedIndex ? (
            <IconButton onClick={() => removeComponent(selectedIndex)}>
              <Delete />
            </IconButton>
          ) : null}
        </Typography>
        <Divider style={{ marginBottom: '0.5em' }} />

        {currentComponent ? (
          <>
            {rest && mapProperties(rest, null, 0)}

            <div style={{ padding: '0.5rem' }}>
              <TextField
                label={'Duration'}
                value={duration}
                disabled
                fullWidth
                onChange={e => {
                  editComponentProperty(selectedIndex, 'duration', e.target.value);
                }}
              />
            </div>
            <div style={{ padding: '0.5rem' }}>
              <TextField
                label={'Delay'}
                value={delay}
                fullWidth
                onChange={e => {
                  editComponentProperty(selectedIndex, 'delay', e.target.value);
                }}
              />
            </div>
            <Keyframes />
          </>
        ) : (
          <>
            <div style={{ padding: '0.5rem' }}>
              <TextField
                label={'Container width'}
                value={containerProperties.width}
                fullWidth
                onChange={e => {
                  editContainerProperty('width', e.target.value);
                }}
              />
            </div>
            <div style={{ padding: '0.5rem' }}>
              <TextField
                label={'Container height'}
                value={containerProperties.height}
                fullWidth
                onChange={e => {
                  editContainerProperty('height', e.target.value);
                }}
              />
            </div>
            <div style={{ padding: '0.5rem' }}>
              <TextField
                label={'Container Scale'}
                value={containerProperties.containerScale}
                fullWidth
                onChange={e => {
                  editContainerProperty('containerScale', e.target.value);
                }}
              />
            </div>
            <Typography>Select a component in the preview pane to edit it's properties </Typography>
          </>
        )}
      </>
    );
  })
);
