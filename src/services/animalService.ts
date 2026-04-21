import api from "@/lib/api";
import { Animal } from "@/types";

export const fetchAnimals = async (): Promise<Animal[]> => {
  const response = await api.get<Animal[]>('/animal');
  return response.data;
}

export const createAnimal = async (dto: any, images: string[] = []): Promise<any> => {
  const formData = new FormData();
  formData.append('dto', JSON.stringify(dto));
  
  for (const uri of images) {
    const filename = uri.split('/').pop() || `image_${Date.now()}.jpg`;
    formData.append('images', {
      uri: uri,
      name: filename,
      type: 'image/jpeg',
    } as any);
  }

  const response = await api.post('/animal', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updateAnimal = async (
  id: string,
  data: any,
  images: string[] = []
): Promise<any> => {
  const formData = new FormData();

  formData.append('dto', JSON.stringify(data));

  for (const uri of images) {
    const filename = uri.split('/').pop() || 'image.jpg';

    formData.append('images', {
      uri,
      name: filename,
      type: 'image/jpeg',
    } as any);
  }

  const response = await api.patch(`/animal/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteAnimal = async (animalId: string): Promise<void> => {
  await api.delete(`/animal/${animalId}`);
};
