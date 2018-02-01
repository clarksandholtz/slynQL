class QueryGate
  # https://github.com/rmosolgo/graphql-ruby/blob/master/guides/queries/analysis.md

  # Called before the visit.
  # Returns the initial value for `memo`
  def initial_value(query)
    {
      current_user: query.context[:current_user],
      authorized: false
    }
  end

  # This is like the `reduce` callback.
  # The return value is passed to the next call as `memo`
  def call(memo, visit_type, irep_node)
    if !memo[:current_user]
      if visit_type == :enter
        if irep_node.ast_node.is_a?(GraphQL::Language::Nodes::Field)
          # Here's where we whitelist unauthenticated users to make certain queries
          if irep_node.ast_node.name == 'signInUser' ||
             irep_node.ast_node.name == 'registerUser'
            memo[:authorized] = true
          end
        end
      end
    else
      memo[:authorized] = true
    end
    memo
  end

  # Called when we're done the whole visit.
  # The return value may be a GraphQL::AnalysisError (or an array of them).
  # Or, you can use this hook to write to a log, etc
  def final_value(memo)
    raise GraphQL::AnalysisError, 'Didn\'t pass QueryGate' unless memo[:authorized]
  end
end
