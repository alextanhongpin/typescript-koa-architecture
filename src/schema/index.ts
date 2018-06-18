import Ajv from 'ajv'
import { error } from 'util';

export type SchemaDictionary = {
  [index: string]: Ajv.ValidateFunction
}

export class Schema {
  private dict: SchemaDictionary = {};
  constructor(private ajv: Ajv.Ajv) { }

  register(name: string, schema: object): Schema {
    if (this.dict[name]) {
      console.warn(`schemaWarn: overriding schema with the name ${name}`)
    }
    this.dict[name] = this.ajv.compile(schema)
    return this
  }

  async validateAsync(name: string, schema: object): Promise<any> {
    if (!this.dict[name]) {
      throw new Error(`schemaError: schema with name ${name} not found`)
    }
    let validate = this.dict[name]
    let valid = validate(schema)
    if (!valid) {
      throw validate.errors
    }
    return schema
  }
}

export function makeSchema(): Schema {
  let defaultOptions = {
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true
  }
  return new Schema(new Ajv(defaultOptions))
}
