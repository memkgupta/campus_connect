import { z } from 'zod';
import { type Field } from '@/types/index';

export const createFieldSchema = (field: Field) => {
  let schema:z.ZodType<any>;

  switch (field.fieldType) {
    case 'text':
      schema = z.string();
      break;
    case 'textarea':
      schema = z.string();
      break;
    case 'number':
      schema = z.number();
      break;
    case 'date':
      schema = z.string().datetime();
      break;
    case 'select':
    case 'radio':
      schema = z.enum(field.options as [string, ...string[]]);
      break;
    case 'checkbox':
      schema = z.boolean();
      break;
    case 'image':
      schema = z.instanceof(File);
      break;
  }

  return field.isRequired ? schema : schema.optional();
};