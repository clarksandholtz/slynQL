Types::AvatarType = GraphQL::ObjectType.define do
  name 'AvatarType'
  description 'An avatar with multiple sizes'

  field :thumbUrl, types.String do
    resolve ->(avatar, _args, _ctx) { avatar.url(:thumb) }
  end
  field :mediumUrl, types.String do
    resolve ->(avatar, _args, _ctx) { avatar.url(:medium) }
  end
  field :largeUrl, types.String do
    resolve ->(avatar, _args, _ctx) { avatar.url(:large) }
  end
  field :originalUrl, types.String do
    resolve ->(avatar, _args, _ctx) { avatar.url }
  end
end
