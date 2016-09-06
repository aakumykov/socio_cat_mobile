class AddContent < ActiveRecord::Migration[5.0]
	def change
		add_column :items, :content, :string
	end
end