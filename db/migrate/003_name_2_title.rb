class Name2Title < ActiveRecord::Migration[5.0]
	def change
		rename_column :items, :name, :title
	end
end