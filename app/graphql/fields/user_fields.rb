module Fields::UserFields
  User = GraphQL::Field.define do
    type types[Types::UserType]
    description 'Fetches a user by ID'

    # Inputs
    argument :userId, !types.ID, as: :user_id

    resolve lambda { |_obj, args, ctx|
      user = GraphqlSchema.object_from_id(args[:user_id], ctx)
      ctx[:pundit].authorize user, :show?

      user
    }
  end
end
