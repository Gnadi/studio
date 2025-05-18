"use client";

import type { FoodItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Edit3, Save, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useState, type ChangeEvent, type FormEvent } from 'react';

interface FoodItemCardProps {
  item: FoodItem;
  onUpdate: (updatedItem: FoodItem) => void;
  onRemove: (itemId: string) => void;
  isEditingInitially?: boolean;
}

export default function FoodItemCard({ item, onUpdate, onRemove, isEditingInitially = false }: FoodItemCardProps) {
  const [isEditing, setIsEditing] = useState(isEditingInitially);
  const [editableItem, setEditableItem] = useState<FoodItem>(item);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableItem(prev => ({
      ...prev,
      [name]: name === 'calories' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleSave = (e?: FormEvent) => {
    e?.preventDefault();
    onUpdate(editableItem);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditableItem(item); // Reset changes
    setIsEditing(false);
    if (isEditingInitially) { // If it was a new item being added
      onRemove(item.id);
    }
  };


  if (isEditing) {
    return (
      <Card className="mb-4 bg-background shadow-md border-primary">
        <CardContent className="p-4">
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <Label htmlFor={`name-${item.id}`} className="text-sm font-medium">Food Name</Label>
              <Input
                id={`name-${item.id}`}
                name="name"
                value={editableItem.name}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`quantity-${item.id}`} className="text-sm font-medium">Quantity</Label>
                <Input
                  id={`quantity-${item.id}`}
                  name="quantity"
                  value={editableItem.quantity}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`calories-${item.id}`} className="text-sm font-medium">Calories</Label>
                <Input
                  id={`calories-${item.id}`}
                  name="calories"
                  type="number"
                  value={editableItem.calories}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                <XCircle size={16} className="mr-1" /> Cancel
              </Button>
              <Button type="submit" variant="default" size="sm">
                <Save size={16} className="mr-1" /> Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-3 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-lg text-primary-foreground">{item.name}</h4>
            <p className="text-sm text-muted-foreground">
              {item.quantity} - <span className="font-medium">{item.calories} kcal</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsEditing(true)} aria-label="Edit item">
              <Edit3 size={18} />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => onRemove(item.id)} aria-label="Remove item">
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}