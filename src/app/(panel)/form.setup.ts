"use client"

import { registerField } from "../../components/console/forms/form-context/FieldRegistry"

import { Checkbox } from "../../components/console/ui/inputs/checkbox"
import { ColorPicker } from "../../components/console/ui/inputs/color-picker"
import { Input } from "../../components/console/ui/inputs/input"
import { MultiSelect } from "../../components/console/ui/inputs/multi-select"
import { RangeSlider } from "../../components/console/ui/inputs/range-slider"
import { Select } from "../../components/console/ui/inputs/select"
import { DateRangePicker } from "../../components/console/forms/date-range/date-range-picker"
import { RepeatableField } from "../../components/console/forms/schema/repeatable-field"
import { AsyncSelect } from "../../components/console/forms/form-context/AsyncSelect"
import { GroupWrapper } from "../../components/console/forms/form-context/GroupWrapper"
import { NumberInput } from "../../components/console/forms/form-context/NumberInput"
import { SignaturePad } from "../../components/console/forms/form-context/SignaturePad"

registerField("text", Input)
registerField("number", NumberInput)
registerField("select", Select)
registerField("async-select", AsyncSelect)
registerField("multiselect", MultiSelect)
registerField("checkbox", Checkbox)
registerField("color", ColorPicker)
registerField("range", RangeSlider)
registerField("date-range", DateRangePicker)
registerField("signature", SignaturePad)
registerField("repeatable", RepeatableField)
registerField("group", GroupWrapper)

console.log(">>> FORM SETUP LOADED <<<")
