
import React from 'react'

export default class Input extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      input: 0,
    }
  }
  shouldComponentUpdate(nextProps)
  {
    const val = (nextProps.value != this.state.input.value)
    return val
  }

  ref = (elem) =>
  {
    this.state.input = elem;
  }

  render()
  {
    return (
      <input
        ref={this.ref}
        type="text"
        defaultValue={this.props.value || ""}
        className="input-s"
        placeholder="Поиск...."
        onChange={(ev) =>
        {
          this.props.onChange(ev.target.value)
        }}
      />
    )
  }
}