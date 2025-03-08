import { Booking } from '../../../domain/entities/booking';
import { Property } from '../../../domain/entities/property';
import { User } from '../../../domain/entities/user';
import { DateRange } from '../../../domain/value_objects/date_range';
import { BookingEntity } from '../entities/booking_entity';
import { PropertyEntity } from '../entities/property_entity';
import { UserEntity } from '../entities/user_entity';
import { BookingMapper } from './booking_mapper';

describe('BookingMapper', () => {

  it('deve converter BookingProperty em Booking corretamente', () => {
    const userEntity = new UserEntity();
    userEntity.id = '1';
    userEntity.name = 'Vitor L';
    
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = '1';
    propertyEntity.name = 'Casa de praia';
    propertyEntity.description = 'Casa de praia em Santos';
    propertyEntity.maxGuests = 5;
    propertyEntity.basePricePerNight = 1000;

    const bookingEntity = new BookingEntity();
    bookingEntity.id = '1';
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = new Date();
    bookingEntity.endDate = new Date();
    bookingEntity.guestCount = 5;
    bookingEntity.totalPrice = 1000;
    bookingEntity.status = 'CONFIRMED';
    const booking = BookingMapper.toDomain(bookingEntity);
    expect(booking.getId()).toBe(bookingEntity.id);
    expect(booking.getProperty().getId()).toBe(bookingEntity.property.id);
    expect(booking.getGuest().getId()).toBe(bookingEntity.guest.id);
    expect(booking.getDateRange().getStartDate()).toBe(bookingEntity.startDate);
    expect(booking.getDateRange().getEndDate()).toBe(bookingEntity.endDate);
    expect(booking.getGuestCount()).toBe(bookingEntity.guestCount);
    expect(booking.getTotalPrice()).toBe(bookingEntity.totalPrice);
    expect(booking.getStatus()).toBe(bookingEntity.status);
  });

  it('deve converter Booking em BookingEntity corretamente', () => {
    const user = new User('1', 'Vitor L');
    const property = new Property(
      '1',
      'Casa de praia',
      'Casa de praia em Santos',
      5,
      1000
    );
    const booking = new Booking(
      '1',
      property,
      user,
      new DateRange(new Date('2025-02-01'), new Date('2025-02-05')),
      5
    );
    const bookingEntity = BookingMapper.toPersistence(booking);
    expect(bookingEntity.id).toBe(booking.getId());
    expect(bookingEntity.property.id).toBe(booking.getProperty().getId());
    expect(bookingEntity.guest.id).toBe(booking.getGuest().getId());
    expect(bookingEntity.startDate).toBe(booking.getDateRange().getStartDate());
    expect(bookingEntity.endDate).toBe(booking.getDateRange().getEndDate());
    expect(bookingEntity.guestCount).toBe(booking.getGuestCount());
    expect(bookingEntity.totalPrice).toBe(booking.getTotalPrice());
    expect(bookingEntity.status).toBe(booking.getStatus());
  });
  
  it('deve lançar um erro de validação ao possuir dados inválidos no BookingEntity', () => {
    const userEntity = new UserEntity();
    userEntity.id = '1';
    userEntity.name = 'Vitor L';

    const propertyEntity = new PropertyEntity();
    propertyEntity.id = '1';
    propertyEntity.name = 'Casa de praia';
    propertyEntity.description = 'Casa de praia em Santos';
    propertyEntity.maxGuests = 2;
    propertyEntity.basePricePerNight = 1000;
    
    const bookingEntity = new BookingEntity();
    bookingEntity.id = '1';
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = new Date();
    bookingEntity.endDate = new Date();
    bookingEntity.guestCount = 5;
    expect(() => BookingMapper.toDomain(bookingEntity)).toThrow('Número máximo de hóspedes excedido. Máximo permitido: 2');

    bookingEntity.guestCount = 0;
    expect(() => BookingMapper.toDomain(bookingEntity)).toThrow('O número de hóspedes deve ser maior que zero');
  });

  it('deve lançar um erro de validação ao faltar dados obrigatórios em BookingEntity', () => {
    const userEntity = new UserEntity();
    userEntity.id = '1';
    userEntity.name = 'Vitor L';

    const propertyEntity = new PropertyEntity();
    propertyEntity.id = '1';
    
    const bookingEntity = new BookingEntity();
    bookingEntity.id = '1';
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = new Date();
    bookingEntity.endDate = new Date();
    bookingEntity.guestCount = 5;
    expect(() => BookingMapper.toDomain(bookingEntity)).toThrow('O nome é obrigatório');
  });
});