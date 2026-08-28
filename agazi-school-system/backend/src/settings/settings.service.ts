import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Stream } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  private classCapacityKey(gradeLevel: number, stream?: Stream | null) {
    if (stream) return `class_capacity_grade_${gradeLevel}_${stream}`;
    return `class_capacity_grade_${gradeLevel}`;
  }

  async getClassCapacity(gradeLevel: number, stream?: Stream | null) {
    const streamKey = stream ? this.classCapacityKey(gradeLevel, stream) : null;
    const gradeKey = this.classCapacityKey(gradeLevel, null);

    const setting = await this.prisma.systemSettings.findFirst({
      where: {
        key: streamKey ? { in: [streamKey, gradeKey] } : gradeKey,
      },
      orderBy: streamKey ? { key: 'asc' } : undefined,
    });

    if (!setting) return { key: streamKey ?? gradeKey, capacity: 40 };

    const capacity = Number(setting.value);
    if (!Number.isFinite(capacity) || capacity <= 0) {
      throw new BadRequestException(`Invalid class capacity value for key: ${setting.key}`);
    }

    return { key: setting.key, capacity };
  }

  async setClassCapacity(params: {
    gradeLevel: number;
    stream?: Stream | null;
    maxStudentsPerSection: number;
  }) {
    const { gradeLevel, stream, maxStudentsPerSection } = params;
    if (!Number.isFinite(maxStudentsPerSection) || maxStudentsPerSection <= 0) {
      throw new BadRequestException('maxStudentsPerSection must be a positive number');
    }

    const key = this.classCapacityKey(gradeLevel, stream ?? null);

    const setting = await this.prisma.systemSettings.upsert({
      where: { key },
      update: { value: String(maxStudentsPerSection) },
      create: {
        key,
        value: String(maxStudentsPerSection),
        description: `Max students per section for grade ${gradeLevel}${stream ? ` (${stream})` : ''}`,
      },
    });

    return { key: setting.key, capacity: Number(setting.value) };
  }
}

