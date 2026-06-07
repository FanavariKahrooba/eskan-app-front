"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FieldRenderer } from "../schema/field-renderer"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "./sortable-item"

export function RepeatableField({ field, value = [], onChange, errors = {} }: any) {
  const [collapsed, setCollapsed]: any = useState({})

  const addItem = () => {
    const newItem: any = {}

    // مقداردهی اولیه فیلدها برای انواع input
    field.fields.forEach((f: any) => {
      newItem[f.name] = f.default ?? ""
    })

    onChange([...(value || []), newItem])
  }

  const removeItem = (index: number) => {
    const newArr = value.filter((_: any, i: number) => i !== index)
    onChange(newArr)
  }

  const duplicateItem = (index: number) => {
    const copied = JSON.parse(JSON.stringify(value[index]))
    onChange([...value.slice(0, index + 1), copied, ...value.slice(index + 1)])
  }

  const toggleCollapse = (index: number) => {
    setCollapsed((prev: any) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = active.id
      const newIndex = over.id
      onChange(arrayMove(value, oldIndex, newIndex))
    }
  }

  return (
    <div className="border rounded-xl p-3 bg-muted/30 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <label className="font-medium text-sm">{field.label}</label>

        <button type="button" className="text-primary text-sm hover:underline" onClick={addItem}>
          + افزودن
        </button>
      </div>

      {/* Drag-and-Drop Context */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={(value || []).map((_: any, i: number) => i)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {value?.map((item: any, index: number) => {
              const itemHasError = Object.keys(errors).some((key) => key.startsWith(`${field.name}.${index}`))

              return (
                <SortableItem key={index} id={index}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`rounded-lg bg-white shadow-sm border transition-colors ${itemHasError ? "border-red-400" : "border-gray-200"}`}
                  >
                    {/* Item Header */}
                    <div className={`flex items-center justify-between p-3 border-b ${itemHasError ? "bg-red-50" : "bg-gray-50"}`}>
                      <div className={`font-medium text-sm flex items-center gap-2 ${itemHasError ? "text-red-600" : "text-gray-800"}`}>
                        {field.itemTitle ? field.itemTitle(item, index) : `آیتم ${index + 1}`}

                        {itemHasError && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">خطا</span>}
                      </div>

                      <div className="flex gap-4 text-sm">
                        <button type="button" onClick={() => duplicateItem(index)} className="hover:text-primary">
                          کپی
                        </button>

                        <button type="button" onClick={() => toggleCollapse(index)} className="hover:text-primary">
                          {collapsed[index] ? "باز کردن" : "بستن"}
                        </button>

                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:underline">
                          حذف
                        </button>
                      </div>
                    </div>

                    {/* Item Body */}
                    {!collapsed[index] && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {field.fields.map((subField: any) => {
                          const subPath = `${field.name}.${index}.${subField.name}`
                          const subError = errors[subPath] || null

                          return (
                            <FieldRenderer
                              key={subField.name}
                              field={subField}
                              value={item[subField.name]}
                              error={subError}
                              onChange={(v: any) => {
                                const updated = [...value]
                                updated[index] = {
                                  ...updated[index],
                                  [subField.name]: v,
                                }
                                onChange(updated)
                              }}
                            />
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                </SortableItem>
              )
            })}
          </AnimatePresence>
        </SortableContext>
      </DndContext>
    </div>
  )
}
