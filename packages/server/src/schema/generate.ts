import { lexicographicSortSchema, printSchema } from "graphql";
import { schema } from "./schema.js";

console.log(printSchema(lexicographicSortSchema(schema)));
