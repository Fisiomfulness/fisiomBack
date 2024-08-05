import { Specialty } from '#src/models/Specialty';
import { Criteria } from '#src/util/criteria/criteria';

export interface SpecialtyRepository {
  /**
   * NOTE: `save` verifica si el dato ya existe, de ser asi lo actualiza, de lo
   * contrario lo crea. Quizas mas adelante se use `save` en lugar de los
   * metodos `update` y `create`
   *
   * save(_specialty) {
   *   throw new Error('Not implemented');
   * }
   */

  create(value: Specialty): Promise<Specialty>;

  update(specialty: Specialty): Promise<Specialty>;

  delete(id: string): Promise<Specialty>;

  matching(criteria: Criteria): Promise<{
    count: number;
    results: Specialty[];
  }>;
}
