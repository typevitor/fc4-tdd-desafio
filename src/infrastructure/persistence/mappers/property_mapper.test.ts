import { Property } from '../../../domain/entities/property';
import { PropertyEntity } from '../entities/property_entity';
import { PropertyMapper } from './property_mapper';

describe('PropertyMapper', () => {

  it('deve converter PropertyEntity em Property corretamente', () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = '1';
    propertyEntity.name = 'Casa de praia';
    propertyEntity.description = 'Casa de praia em Guarujá';
    propertyEntity.maxGuests = 5;
    propertyEntity.basePricePerNight = 1000;
    const property = PropertyMapper.toDomain(propertyEntity);
    expect(property.getId()).toBe('1');
    expect(property.getName()).toBe('Casa de praia');
    expect(property.getDescription()).toBe('Casa de praia em Guarujá');
    expect(property.getMaxGuests()).toBe(5);
    expect(property.getBasePricePerNight()).toBe(1000);
  });

  it('deve converter Property em PropertyEntity corretamente', () => {
    const property = new Property(
      '1',
      'Casa de praia',
      'Casa de praia em Guarujá',
      5,
      1000
    )
    const propertyEntity = PropertyMapper.toPersistence(property);
    expect(propertyEntity.id).toBe('1');
    expect(propertyEntity.name).toBe('Casa de praia');
    expect(propertyEntity.description).toBe('Casa de praia em Guarujá');
    expect(propertyEntity.maxGuests).toBe(5);
    expect(propertyEntity.basePricePerNight).toBe(1000);
  });

  it('deve lançar um erro de validação ao faltar campos obrigatórios no PropertyEntity', () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = '1';
    //Property sem Nome definido.
    propertyEntity.description = 'Casa de praia em Guarujá';
    propertyEntity.maxGuests = 5;
    propertyEntity.basePricePerNight = 1000;
    expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow('O nome é obrigatório');
  });
});