import { test, /*describe, before, after, afterEach, beforeEach*/ } from 'tezt'
import React from 'react'
import { useFieldz } from './lib'
import expect from "expect"
import { render, fireEvent, waitForElement } from '@testing-library/react'
import { nameValidator } from 'validatorz'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

const fieldProperties = {
  firstName: {
    init: "",
    validate: nameValidator
  },
  customField: {
    validate: (val: string) => {
      if (val !== "hello") {
        return [new Error("value must be hello!")]
      }
      return []
    },
    init: "this is my init value"
  }
}


const camelToTitle = camelCase => camelCase
    .replace(/([A-Z])/g, match => ` ${match}`)
    .replace(/^./g, match => match.toUpperCase())
    .trim()

const TestForm = () => {
  const [{actions, fieldsState}, setFieldsState] = useFieldz(fieldProperties)
  const {setValue, setValues, setTouched, resetField, resetFields } = actions

  return (
    <form>
      {Object.entries(fieldsState).map(([fieldName, {errors}]) => <div key={fieldName}>Error: {JSON.stringify(errors.map(err => err.toString()))}</div>)}
      {Object.entries(fieldsState)
        .map(([fieldName, {errors, value, touched, pristine}]) => (
          <div key={fieldName}>
            {(touched && errors.length) ? <span className="input-error">{errors.map(err => <div>{err.toString()}</div>)}</span> : ""}
            <label htmlFor={fieldName}>{camelToTitle(fieldName)}</label>
            <input
              name={fieldName}
              id={fieldName}
              value={value}
              aria-label={fieldName}
              onChange={e => setFieldsState(setValue(fieldName, e.target.value))}
              onBlur={_ => setFieldsState(setTouched(fieldName))}
            />
          </div>
        ))
      }
    </form>
  )
}
test("it works", () => {
  const { asFragment, getByText, getByRole, getByLabelText } = render(<TestForm />)
  const input = getByLabelText("Custom Field")
  userEvent.type(input, "helo")
  input.blur()
  const nameInput = getByLabelText("First Name")
  userEvent.type(nameInput, "Zane")
  nameInput.blur()
  expect(asFragment()).toMatchSnapshot()
  userEvent.type(input, "hello")
  input.blur()
  expect(asFragment()).toMatchSnapshot()
})