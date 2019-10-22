import { test, /*describe, before, after, afterEach, beforeEach*/ } from 'tezt'
import { useFieldz } from './lib'
import expect from "expect"
import { render, fireEvent, waitForElement } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

const fieldProperties = {
  firstName: {
    errors: [],
    touched: false,
    pristine: true,
    value: ''
  },
  customField: {
    errors: [],
    touched: false,
    pristine: true,
    value: 'this is my init value'
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
      {Object.entries(fieldsState)
        .map(([fieldName, {errors, value, touched, pristine}]) => (
          <div>
            {(touched && errors.length) ? <span className="input-error">{errors.map(err => <div>{err.toString()}</div>)}</span> : ""}
            <label htmlFor={fieldName}>{camelToTitle(fieldName)}</label>
            <input
              name={fieldName}
              value={value}
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
  const { getByText, getByRole, getByLabelText } = render(<TestForm />)
  const input = getByLabelText("Custom Field")
  console.log(input.value)

})