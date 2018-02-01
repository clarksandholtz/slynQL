module Mutations::UserMutations
  Register = GraphQL::Relay::Mutation.define do
    name 'registerUser'
    description 'Registers a user'

    # Inputs
    input_field :email, !types.String
    input_field :password, !types.String
    input_field :firstName, !types.String, as: :first_name
    input_field :lastName, !types.String, as: :last_name
    input_field :base64Avatar, as: :avatar do
      type types.String
      description 'The base64 encoded version of the avatar image with metadata prefix e.g. "data:image/png;base64,iVBG..."'
    end

    # Returns
    return_field :user, Types::UserType

    resolve lambda { |_object, inputs, _ctx|
      valid_inputs = ActiveSupport::HashWithIndifferentAccess.new(inputs.to_h)

      user = User.new(valid_inputs)
      if user.save
        { user: user }
      else
        GraphQL::ExecutionError.new("Error creating user: #{user.errors.full_messages.join(', ')}")
      end
    }
  end

  RegisterViaOmniauth = GraphQL::Relay::Mutation.define do
    name 'registerUserViaOmniauth'
    description 'Registers a user via an oauth provider like Facebook, Google, Twitter etc...'

    # Inputs
    input_field :email, types.String
    input_field :provider, types.String
    input_field :uid, types.String

    # Returns
    return_field :user, Types::UserType

    resolve lambda { |_object, inputs, _ctx|
      valid_inputs = ActiveSupport::HashWithIndifferentAccess.new(inputs.to_h)

      user = User.from_omniauth(valid_inputs)

      if user
        { user: user }
      else
        GraphQL::ExecutionError.new("Error creating user: #{user.errors.full_messages.join(', ')}")
      end
    }
  end

  SignIn = GraphQL::Relay::Mutation.define do
    name 'signInUser'
    description 'Signs in a user'

    # Inputs
    input_field :email, !types.String
    input_field :password, !types.String

    # Returns
    return_field :user, Types::UserType

    resolve lambda { |_object, inputs, _ctx|
      valid_inputs = ActiveSupport::HashWithIndifferentAccess.new(inputs.to_h)

      user = User.find_for_authentication(email: valid_inputs[:email])
      return GraphQL::ExecutionError.new('Email not found') unless user
      valid = user.valid_password?(valid_inputs[:password])

      if valid
        { user: user }
      else
        GraphQL::ExecutionError.new("Invalid password: #{user.errors.full_messages.join(', ')}")
      end
    }
  end

  Update = GraphQL::Relay::Mutation.define do
    name 'updateUser'
    description 'Updates a user'

    # Inputs
    input_field :userId, !types.ID, as: :user_id
    input_field :email, types.String
    input_field :firstName, types.String, as: :first_name
    input_field :lastName, types.String, as: :last_name
    input_field :password, types.String
    input_field :base64Avatar, as: :avatar do
      type types.String
      description 'The base64 encoded version of the avatar image with metadata prefix e.g. "data:image/png;base64,iVBG..."'
    end

    # Returns
    return_field :user, Types::UserType

    resolve lambda { |_object, inputs, ctx|
      user = GraphqlSchema.object_from_id(inputs[:user_id], ctx)
      ctx[:pundit].authorize user, :update?
      valid_inputs = ActiveSupport::HashWithIndifferentAccess.new(inputs.to_h).except(:user_id)

      if user.update_attributes(valid_inputs)
        { user: user }
      else
        GraphQL::ExecutionError.new("Error updating user: #{user.errors.full_messages.join(', ')}")
      end
    }
  end
end
