import type { Schema, Struct } from '@strapi/strapi';

export interface ThemeCustomization extends Struct.ComponentSchema {
  collectionName: 'components_theme_customizations';
  info: {
    displayName: 'Seasons';
    icon: 'paint';
  };
  attributes: {
    Heading: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Subheading: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'theme.customization': ThemeCustomization;
    }
  }
}
