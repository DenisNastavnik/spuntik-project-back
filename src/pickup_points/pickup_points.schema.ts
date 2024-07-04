import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class PickupPoint {
  @ApiProperty({ example: '100', description: 'Долгота' })
  @Prop({ type: String })
  logitude: string;

  @ApiProperty({ example: '200', description: 'Ширина' })
  @Prop({ type: String })
  latitude: string;

  @ApiProperty({
    example: {
      region: 'USA',
      city: 'LA',
      street_name: '1-st Avenue',
      street_number: '20',
    },
    description: 'Адрес',
  })
  @Prop({
    type: {
      region: String,
      city: String,
      street_cname: String,
      street_anme: String,
    },
  })
  address: { region: string; city: string; street_name: string; street_number: string };
}

export const PickupPointSchema = SchemaFactory.createForClass(PickupPoint);
