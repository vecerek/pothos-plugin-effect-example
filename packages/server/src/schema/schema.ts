import SchemaBuilder from "@pothos/core";
import ErrorsPlugin from "@pothos/plugin-errors";
import RelayPlugin from "@pothos/plugin-relay";

interface Types {
  Context: {};
  Interfaces: {
    Error: { message: string; _tag: string };
  };
  Objects: {
    Resource: {
      id: string;
    };
  };
}

const builder = new SchemaBuilder<Types>({
  plugins: [ErrorsPlugin, RelayPlugin],
  errorOptions: {
    defaultTypes: [],
  },
  relayOptions: {
    clientMutationId: "omit",
  },
});

const ErrorInterface = builder.interfaceRef<Error>("Error").implement({
  fields: (t) => ({
    message: t.exposeString("message"),
  }),
});

class InvalidInputError extends Error {
  readonly _tag = "NotFound";
}

builder.objectType(InvalidInputError, {
  interfaces: [ErrorInterface],
  name: "InvalidInputError",
});

builder.objectType("Resource", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});

builder.queryType({
  fields: (t) => ({
    resource: t.field({
      type: "Resource",
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (_parent, args) => ({
        id: String(args.id),
      }),
    }),
  }),
});

builder.mutationType({});

builder.relayMutationField(
  "resourceCreate",
  {
    inputFields: (t) => ({
      id: t.string({ required: true }),
    }),
  },
  {
    errors: {
      directResult: true,
      types: [InvalidInputError],
    },
    resolve: async (_root, args, _env) => {
      if (args.input.id === "-1") {
        throw new InvalidInputError(`${args.input.id} is not a valid ID`);
      }

      return {
        resource: {
          id: args.input.id,
        },
      };
    },
  },
  {
    outputFields: (t) => ({
      resource: t.expose("resource", {
        nullable: false,
        type: "Resource",
      }),
    }),
  }
);

export const schema = builder.toSchema({ sortSchema: true });
