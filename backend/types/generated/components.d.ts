import type { Schema, Attribute } from '@strapi/strapi';

export interface ItemItemsTest extends Schema.Component {
  collectionName: 'components_item_items_tests';
  info: {
    displayName: 'Items';
    icon: 'cube';
    description: '';
  };
  attributes: {
    quantity: Attribute.Decimal & Attribute.DefaultTo<0>;
    itemId: Attribute.Integer;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'item.items-test': ItemItemsTest;
    }
  }
}
