Types::UserType = GraphQL::ObjectType.define do
  name 'UserType'
  description 'A user with token'

  implements GraphQL::Relay::Node.interface

  global_id_field :id

  field :email, types.String
  field :firstName, types.String, property: :first_name
  field :lastName, types.String, property: :last_name
  field :authenticationToken, types.String, property: :authentication_token
  field :avatar, Types::AvatarType
end
