"use client";

import type React from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, UploadCloud, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PhotoUploadFormProps {
  onEstimate: (photoDataUri: string) => Promise<void>;
  isEstimating: boolean;
  estimationError: string | null;
}

export default function PhotoUploadForm({ onEstimate, isEstimating, estimationError }: PhotoUploadFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (photoPreview) {
      await onEstimate(photoPreview);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera size={28} className="text-primary" />
          Upload Meal Photo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="photo-upload" className="sr-only">Upload Meal Photo</Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              disabled={isEstimating}
            />
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="w-full"
              disabled={isEstimating}
            >
              <UploadCloud size={20} className="mr-2" />
              Choose Photo
            </Button>
          </div>

          {photoPreview && (
            <div className="mt-4 border border-border rounded-md p-2 bg-muted/50">
              <Image
                src={photoPreview}
                alt="Meal preview"
                width={400}
                height={300}
                className="rounded-md object-contain max-h-64 w-auto mx-auto"
                data-ai-hint="food meal"
              />
            </div>
          )}

          {estimationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Estimation Error</AlertTitle>
              <AlertDescription>{estimationError}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={!photoPreview || isEstimating}
          >
            {isEstimating ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Estimating Calories...
              </>
            ) : (
              'Estimate Calories'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}