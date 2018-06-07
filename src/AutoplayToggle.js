import React from 'react';
import { withContext } from './Context';
import Switch from './Switch';

const AutoplayToggle = (props) => (
  <Switch
    value={props.context.autoplay}
    onChange={() => props.context.set(state => ({autoplay: !state.autoplay}))}
    label="Reproducción automática"
    title="Reproducir la siguiente cancion de la lista al terminar la canción actual"
  />
)

export default withContext(AutoplayToggle);
