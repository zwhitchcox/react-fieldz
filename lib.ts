import { fieldz } from 'fieldz'
import { IFieldzActions, IFieldzState } from "fieldz/types"
import { useState } from 'react'
import React from 'react'

type useFieldzReturnType = [{actions: IFieldzActions, fieldsState: IFieldzState}, React.Dispatch<any>]

export const useFieldz  = (fieldProperties): useFieldzReturnType  => {
  const [[actions, fieldsState], _setFieldsState] = useState(() => fieldz(fieldProperties))
  const setFieldsState = state => _setFieldsState([actions, state])
  return [{
    actions,
    fieldsState,
  }, setFieldsState]
}