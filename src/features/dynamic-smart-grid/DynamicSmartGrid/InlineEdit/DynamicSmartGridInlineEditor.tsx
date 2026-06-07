"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";
import { DynamicGridColumn } from "..";

type DynamicSmartGridInlineEditorProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> = {
  row: TData;
  rowId: string;
  rowIndex: number;
  column: DynamicGridColumn<TData>;
  value: unknown;
  onCancel: () => void;
  onCommit: () => void;
};

export function DynamicSmartGridInlineEditor<
  TData extends Record<string, unknown> = Record<string, unknown>,
>({
  row,
  rowId,
  rowIndex,
  column,
  value,
  onCancel,
  onCommit,
}: DynamicSmartGridInlineEditorProps<TData>) {
  const grid = useDynamicSmartGridContext<TData>();

  const { props } = grid;

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const initialValue = useMemo(() => {
    if (value === null || value === undefined) return "";
    return String(value);
  }, [value]);

  const [draftValue, setDraftValue] = useState(initialValue);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select?.();
  }, []);

  const commit = () => {
    props.onCellEdit?.({
      row,
      rowId,
      rowIndex,
      column,
      columnId: column.id,
      previousValue: value,
      nextValue: draftValue,
    });

    onCommit();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      commit();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  };

  if (column.editComponent) {
    return (
      <div className="dsg-inline-editor-custom">
        {column.editComponent({
          row,
          rowIndex,
          rowId,
          value,
          draftValue,
          setDraftValue,
          column,
          commit,
          cancel: onCancel,
        })}
      </div>
    );
  }

  if (column.editVariant === "textarea") {
    return (
      <div className="dsg-inline-editor">
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          className="dsg-input dsg-inline-textarea"
          value={draftValue}
          onChange={(event) => setDraftValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
        />

        <div className="dsg-inline-editor-actions">
          <button type="button" className="dsg-mini-btn" onMouseDown={commit}>
            ذخیره
          </button>

          <button type="button" className="dsg-mini-btn" onMouseDown={onCancel}>
            لغو
          </button>
        </div>
      </div>
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      className="dsg-input dsg-inline-input"
      value={draftValue}
      type={column.editVariant === "number" ? "number" : "text"}
      onChange={(event) => setDraftValue(event.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={commit}
    />
  );
}
