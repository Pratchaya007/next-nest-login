import { BadRequestException, ValidationPipe } from '@nestjs/common';

export class GlobalValidationPip extends ValidationPipe {
  constructor() {
    super({
      transform: true, //ให้ NestJS แปลง request body เป็น DTO class อัตโนมัติ
      whitelist: true, //ลบ field ที่ไม่มีใน DTO ออก
      exceptionFactory(errors) {
        //NestJS จะเรียก function นี้เมื่อ validation ไม่ผ่าน
        const formatedErrors = errors.reduce<Record<string, string[]>>(
          (acc, el) => {
            //acc = object ที่กำลังสะสมค่า  el = ValidationError ปัจจุบัน
            if (el.constraints)
              //ตรวจว่ามี validation error หรือไม่
              acc[el.property] = Object.values(el.constraints);
            return acc;
          },
          {},
        );
        throw new BadRequestException({
          message: 'The provided data is invalid',
          code: 'Validation Error',
          details: formatedErrors,
        });
      },
    });
  }
}

// logic เหมือนกันแต่อ่านง่ายกว่าว่างั้น
// export class exceptionFactory(errors) {
//   const details: Record<string, string[]> = {};
//   for (const error of errors) {
//     if (!error.constraints) continue;
//     details[error.property] =
//       Object.values(error.constraints);
//   }
//   throw new BadRequestException({
//     message: 'The provided data is invalid',
//     code: 'Validation Error',
//     details,
//   });
// }
