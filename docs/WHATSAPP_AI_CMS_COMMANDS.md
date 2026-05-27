# WhatsApp AI CMS Commands

Only allowlisted admin numbers can use these commands. Products are created as drafts first. Review drafts in Sanity Studio before publishing.

## HELP

```text
HELP
```

Returns the available command list.

## ADD_PRODUCT

```text
ADD_PRODUCT
Nama: Rosewood Tote
Harga: 850000
Kategori: Tote Bag
Warna: Cognac
Jenis Kulit: Full-grain cow leather
Ukuran: Medium
Featured: true
Available: true
Deskripsi singkat: Tas tote kulit sapi dengan karakter hangat dan elegan.
```

Attach product photos when adding a product. The webhook will create a Sanity draft and reply with a summary. The owner should review the draft in Sanity Studio before publishing.

## PUBLISH_PRODUCT

```text
PUBLISH_PRODUCT rosewood-tote
```

Publishes a reviewed draft product. Use only after checking content and images in Sanity Studio.

## UPDATE_PRODUCT

```text
UPDATE_PRODUCT rosewood-tote
Harga: 875000
Available: true
```

Updates should be reviewed carefully. The current foundation recognizes the command but keeps production update behavior conservative until the final approval workflow is implemented.

## Rules

- Only admin numbers are accepted.
- Products are created as drafts first.
- Publishing requires an explicit command.
- Attach product photos when adding a product.
- Review in Sanity Studio before publishing.
- Do not send private customer data through this workflow.
