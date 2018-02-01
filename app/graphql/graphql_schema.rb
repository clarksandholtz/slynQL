GraphqlSchema = GraphQL::Schema.define do
  mutation(Types::MutationType)
  query(Types::QueryType)

  # Authorize requests
  query_analyzer QueryGate.new

  id_from_object lambda { |object, type_definition, _query_ctx|
    GraphQL::Schema::UniqueWithinType.encode(type_definition.name, object.id)
  }

  object_from_id lambda { |id, _query_ctx|
    type_name, item_id = GraphQL::Schema::UniqueWithinType.decode(id)

    resolved_type = case type_name.to_sym
                    when :UserType
                      User
                    else
                      # If the type_name is invalid it may have encoded chars that break this message
                      # so now only printing the id
                      raise GraphQL::ExecutionError, "Unexpected GraphQL type from id: #{id}"
                    end
    record = resolved_type.find(item_id)

    record
  }

  resolve_type lambda { |_type, record, _ctx|
    case record
    when User
      Types::UserType
    else
      raise GraphQL::ExecutionError, "Unknown type: #{record}"
    end
  }
end
