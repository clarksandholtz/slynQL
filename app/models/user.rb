class User < ApplicationRecord
  acts_as_token_authenticatable
  acts_as_taggable
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, omniauth_providers: %i[facebook]

  has_attached_file :avatar,
                    styles: {
                      large: '600x600',
                      medium: '300x300>',
                      thumb: '100x100>'
                    },
                    path: '/users/:id/avatar/:style:avatar_extension',
                    default_url: ':missing_avatar',
                    s3_protocol: :https

  validates_attachment_content_type :avatar, content_type: %r{\Aimage\/.*\Z}

  Paperclip.interpolates :avatar_extension do |image, _style|
    extension = File.extname(image.original_filename)
    if !extension || extension == ''
      mime = image.content_type
      extension = Rack::Mime::MIME_TYPES.invert[mime]
    end
    extension
  end

  def self.from_omniauth(auth)
    where(provider: auth['provider'], uid: auth['uid']).first_or_create do |user|
      puts "the auth #{auth.inspect}"
      user.email = auth['email']
      user.password = Devise.friendly_token[0, 20]
      # user.name = auth.info.name   # assuming the user model has a name
      # user.avatar = auth.info.image # assuming the user model has an image
      # If you are using confirmable and the provider(s) you use validate emails,
      # uncomment the line below to skip the confirmation emails.
      # user.skip_confirmation!
    end
  end
end
