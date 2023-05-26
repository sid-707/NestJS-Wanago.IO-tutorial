import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Category from './entities/category.entity';
import { Repository } from 'typeorm';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';
import CategoryNotFoundException from './exceptions/categoryNotFound.exception';

@Injectable()
export default class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: {
        posts: true,
      },
    });
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: {
        id,
      },
      relations: {
        posts: true,
      },
      withDeleted: true,
    });
    if (category) return category;
    throw new CategoryNotFoundException(id);
  }

  async createCategory(category: CreateCategoryDto) {
    const newCategory = await this.categoriesRepository.create(category);
    await this.categoriesRepository.save(newCategory);
    return newCategory;
  }

  async updateCategory(
    id: number,
    category: UpdateCategoryDto,
  ): Promise<Category> {
    await this.categoriesRepository.update(id, category);
    const updatedCategory = await this.categoriesRepository.findOne({
      where: {
        id,
      },
      relations: {
        posts: true,
      },
    });
    if (updatedCategory) return updatedCategory;
    throw new CategoryNotFoundException(id);
  }

  async deleteCategory(id: number): Promise<void> {
    const deleteResponse = await this.categoriesRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new CategoryNotFoundException(id);
    }
  }
}
