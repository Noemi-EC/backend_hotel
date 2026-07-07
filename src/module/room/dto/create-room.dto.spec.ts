import { validate } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';
import { CreateCompanyDto } from '../../company/dto/create-company.dto';

describe('DTO validation hardening', () => {
  it('rejects room codes with forbidden characters', async () => {
    const dto = new CreateRoomDto();
    Object.assign(dto, {
      hotelId: 1,
      code: "room' OR 1=1 --",
      status: 'disponible',
      capacity: 2,
      price: 100,
      category: 'standard',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects company emails that are not valid', async () => {
    const dto = new CreateCompanyDto();
    Object.assign(dto, {
      name: 'Hotel Test',
      ruc: '12345678901',
      address: 'Av. Test 123',
      phone: '999888777',
      email: 'not-an-email',
    });

    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'email')).toBe(true);
  });
});
