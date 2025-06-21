import React, { useState } from 'react'
import type BaseModalInputProps from './base-props'
import { Modal } from './Modal'
import Checkbox from '../ui/Checkbox'
import Button from '../ui/Button'
import TextInput from '../ui/TextInput'

export interface ChecklistModalInputProps extends BaseModalInputProps {
  type: 'checklist'
  title: string
  options?: string[]
  initialValues?: string[]
  allowNewItems?: boolean
  onSubmit: (values: string[]) => void
}

export const ChecklistModalInput: React.FC<ChecklistModalInputProps> = ({
  title,
  options = [],
  initialValues = [],
  allowNewItems = true,
  onSubmit,
  onCancel,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initialValues)
  const [availableOptions, setAvailableOptions] = useState<string[]>(options)
  const [newItemText, setNewItemText] = useState<string>('')

  const handleToggle = (item: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item)
      } else {
        return [...prev, item]
      }
    })
  }

  const handleAddNewItem = () => {
    if (newItemText.trim()) {
      setAvailableOptions((prev) => [...prev, newItemText.trim()])
      setSelectedItems((prev) => [...prev, newItemText.trim()])
      setNewItemText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddNewItem()
    }
  }
  return (
    <Modal isOpen={true} title={title} onClose={onCancel}>
      <div className='checklist-modal'>
        <div
          className='checklist-items'
          style={{ maxHeight: '60vh', overflowY: 'auto' }}
        >
          {availableOptions.map((item, index) => (
            <div key={index} className='checklist-item py-2'>
              <Checkbox
                id={`checklist-item-${index}`}
                checked={selectedItems.includes(item)}
                onChange={() => handleToggle(item)}
                label={item}
              />
            </div>
          ))}
        </div>

        {allowNewItems && (
          <div className='add-new-item mt-4 flex items-center'>
            {' '}
            <TextInput
              value={newItemText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewItemText(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder='Add new item...'
              className='flex-1'
            />
            <Button
              onClick={handleAddNewItem}
              disabled={!newItemText.trim()}
              variant='secondary'
              className='ml-2'
            >
              Add
            </Button>
          </div>
        )}

        <div className='modal-actions mt-6 flex justify-end'>
          <Button onClick={onCancel} variant='secondary' className='mr-2'>
            Cancel
          </Button>
          <Button onClick={() => onSubmit(selectedItems)}>Done</Button>
        </div>
      </div>
    </Modal>
  )
}
