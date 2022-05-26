import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { EntityTarget, getConnection, Repository } from "typeorm";

@Injectable()
export class TenancyService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getEntityRepository<Entity>(
    entity: EntityTarget<Entity>
  ): Repository<Entity> {
    return getConnection(this.request.subdomains[0]).getRepository(entity);
  }

  getSubdomain(): string {
    return this.request.subdomains[0];
  }
}
