Types::MutationType = GraphQL::ObjectType.define do
  name 'Mutation'

  # Users
  field :registerUser, field: Mutations::UserMutations::Register.field
  field :registerUserViaOmniauth, field: Mutations::UserMutations::RegisterViaOmniauth.field
  field :signInUser, field: Mutations::UserMutations::SignIn.field
  field :updateUser, field: Mutations::UserMutations::Update.field
end
