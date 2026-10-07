import { careerPackageDefinitions, type CareerPackageDefinition } from "./package-content";

export interface CareerPackageStore {
  getPackage(packageId: string): Promise<CareerPackageDefinition | undefined>;
}

class LocalCareerPackageStore implements CareerPackageStore {
  async getPackage(packageId: string) {
    return careerPackageDefinitions.find((item) => item.id === packageId);
  }
}

export const careerPackageStore: CareerPackageStore = new LocalCareerPackageStore();

// Storage abstraction:
// replace this implementation with a private object-storage adapter later
// without changing payment verification or the download endpoint.
