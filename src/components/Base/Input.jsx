
import React from 'react'

export default class Input extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      input: 0,
    }

    if (!Input.this)
    {
      Input.this = {};
    }
    if (this.props.id)
    {
      Input.this[this.props.id] = this;
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
        className={this.props.className}
        placeholder={this.props.placeholder}
        onChange={(ev) =>
        {
          this.props.onChange(ev.target.value)
        }}
      />
    )
  }
}