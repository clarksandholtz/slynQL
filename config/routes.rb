Rails.application.routes.draw do
  devise_for :users
  post 'graphql' => 'graphql#execute'
end
