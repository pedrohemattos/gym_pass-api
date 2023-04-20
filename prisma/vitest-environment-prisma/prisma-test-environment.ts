import { Environment } from 'vitest';

export default <Environment>{
  name: 'prisma',
  /** Vai executar antes de cada arquivo de teste: */
  async setup() {
    console.log('Setup')

    /** Vai executar depois de cada arquivo de teste: */
    return {
      teardown() {
        console.log('Teardown')
      } 
    }
  }
}