# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create(
  [
    { id: 1, first_name: 'Luke', last_name: 'Skywalker', email: 'luke@theforce.com', password: 'testing', authentication_token: '123' },
    { id: 2, first_name: 'Han', last_name: 'Solo', email: 'han@theforce.com', password: 'testing', authentication_token: '456' }
  ]
)
ActiveRecord::Base.connection.execute('ALTER SEQUENCE users_id_seq RESTART WITH 3')
