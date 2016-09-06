class RenameUsersToItems < ActiveRecord::Migration[5.0]
	def change
		rename_table :users, :items
	end
end