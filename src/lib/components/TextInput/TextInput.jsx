import React, { Component } from "react";
import classNames from "classnames";
import "./TextInput.scss";

class TextInput extends Component {
  constructor() {
    super();

    this.state = {
      isPristine: true
    };
  }

  onKeyPress = {
    number: e => {
      if (!Number.isNaN(e.key)) {
        e.preventDefault();
      }
    }
  };

  render() {
    const {
      className,
      errorMessage,
      label,
      onChange,
      numPad,
      pattern,
      validate,
      value
    } = this.props;
    const { isPristine } = this.state;
    const hasError = !isPristine && !validate(value);

    return (
      <div
        className={classNames({
          "text-input__wrapper": true,
          label: value !== "",
          placeholder: value === "",
          error: hasError,
          [className]: !!className
        })}
        data-label={label}
      >
        <input
          className="text-input"
          onChange={onChange}
          onBlur={() => {
            if (isPristine) this.setState({ isPristine: false });
          }}
          pattern={pattern}
          type={numPad ? "tel" : "text"}
          value={value}
        />
        <span className="text-input__error">{errorMessage}</span>
      </div>
    );
  }
}

TextInput.defaultProps = {
  errorMessage: "Required",
  validate: value => value !== ""
};

export default TextInput;