class GraphqlController < ApplicationController
  acts_as_token_authentication_handler_for User, fallback: :none

  def execute
    variables = ensure_hash(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      current_user: current_user,
      pundit: self
    }

    result = GraphqlSchema.execute(query, variables: variables, context: context, operation_name: operation_name)

    render json: result
  rescue GraphQL::AnalysisError => e
    render json: { errors: [message: 'You need to be signed in for that.'] }, status: 403
  rescue ActiveRecord::RecordNotFound => e
    render json: { errors: [message: "Record not found. #{e.message}."] }, status: 404
  rescue ActiveRecord::StatementInvalid => e
    render json: { errors: [message: "ActiveRecord::StatementInvali #{e.message}. #{e.backtrace}"] }, status: 404
  rescue NoMethodError => e
    render json: { errors: [message: "NoMethodError. #{e.message}. #{e.backtrace}"] }, status: 500
  rescue Pundit::NotAuthorizedError => e
    policy_name = e.policy.class.to_s.underscore
    render json: { errors: [message: "Back off. You can't do that. Pundit: #{policy_name}.#{e.query}"] }, status: 403
  rescue StandardError => e
    render json: { errors: [message: "Error. #{e.message}. #{e.backtrace}"] }, status: 500
  end

  private

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      if ambiguous_param.present?
        ensure_hash(JSON.parse(ambiguous_param))
      else
        {}
      end
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end
end
